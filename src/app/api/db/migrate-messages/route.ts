/**
 * Database Migration API - Create conversations and private_messages tables
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET() {
  if (!sql) {
    return NextResponse.json({ success: false, message: 'Database not configured' }, { status: 500 });
  }

  try {
    // Create conversations table
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        participant1_id VARCHAR(50),
        participant2_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(participant1_id, participant2_id)
      )
    `;

    // Create private_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS private_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id VARCHAR(50),
        receiver_id VARCHAR(50),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_private_messages_conversation ON private_messages(conversation_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_private_messages_sender ON private_messages(sender_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_private_messages_receiver ON private_messages(receiver_id)`;

    return NextResponse.json({
      success: true,
      message: 'Messages tables created successfully',
      tables: ['conversations', 'private_messages']
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
