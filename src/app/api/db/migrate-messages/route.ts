/**
 * Database Migration API - Create conversations and private_messages tables
 * Safe migration that drops and recreates tables
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET() {
  if (!sql) {
    return NextResponse.json(
      { success: false, message: 'Database not configured' },
      { status: 500 }
    );
  }

  const logs: string[] = [];

  try {
    // Step 1: Drop existing tables (in correct order due to foreign keys)
    logs.push('Dropping existing tables...');

    try {
      await sql`DROP TABLE IF EXISTS private_messages CASCADE`;
      logs.push('Dropped private_messages table');
    } catch (e: any) {
      logs.push('private_messages table did not exist or error: ' + e.message);
    }

    try {
      await sql`DROP TABLE IF EXISTS conversations CASCADE`;
      logs.push('Dropped conversations table');
    } catch (e: any) {
      logs.push('conversations table did not exist or error: ' + e.message);
    }

    // Step 2: Create conversations table (without foreign key to users for flexibility)
    logs.push('Creating conversations table...');
    await sql`
      CREATE TABLE conversations (
        id SERIAL PRIMARY KEY,
        participant1_id VARCHAR(50) NOT NULL,
        participant2_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(participant1_id, participant2_id)
      )
    `;
    logs.push('Created conversations table');

    // Step 3: Create private_messages table
    logs.push('Creating private_messages table...');
    await sql`
      CREATE TABLE private_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id VARCHAR(50) NOT NULL,
        receiver_id VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    logs.push('Created private_messages table');

    // Step 4: Create indexes for better performance
    logs.push('Creating indexes...');
    await sql`CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id)`;
    await sql`CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id)`;
    await sql`CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC)`;
    await sql`CREATE INDEX idx_private_messages_conversation ON private_messages(conversation_id)`;
    await sql`CREATE INDEX idx_private_messages_sender ON private_messages(sender_id)`;
    await sql`CREATE INDEX idx_private_messages_receiver ON private_messages(receiver_id)`;
    await sql`CREATE INDEX idx_private_messages_created ON private_messages(created_at DESC)`;
    logs.push('Created all indexes');

    // Step 5: Verify tables exist
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('conversations', 'private_messages')
    `;
    logs.push(`Verified tables: ${tables.map((t: any) => t.table_name).join(', ')}`);

    return NextResponse.json({
      success: true,
      message: 'Messages tables created successfully',
      tables: ['conversations', 'private_messages'],
      logs,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        logs,
      },
      { status: 500 }
    );
  }
}
