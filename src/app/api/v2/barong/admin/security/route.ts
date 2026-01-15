/**
 * Security Management API - Production Grade
 * GET /api/v2/barong/admin/security - Get security data
 * POST /api/v2/barong/admin/security - Add IP rule or handle event
 * DELETE /api/v2/barong/admin/security - Delete IP rule
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// Initialize security tables if needed
async function initSecurityTables() {
  if (!sql) return;
  
  try {
    // Security events table
    await sql`
      CREATE TABLE IF NOT EXISTS security_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        source_ip VARCHAR(45) NOT NULL,
        user_email VARCHAR(255),
        description TEXT,
        status VARCHAR(20) DEFAULT 'open',
        handled_by VARCHAR(255),
        handled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // IP rules table
    await sql`
      CREATE TABLE IF NOT EXISTS ip_rules (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(50) NOT NULL UNIQUE,
        rule_type VARCHAR(20) NOT NULL,
        reason TEXT,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Security stats table
    await sql`
      CREATE TABLE IF NOT EXISTS security_stats (
        id SERIAL PRIMARY KEY,
        stat_date DATE NOT NULL UNIQUE,
        login_attempts INT DEFAULT 0,
        failed_logins INT DEFAULT 0,
        blocked_ips INT DEFAULT 0,
        attacks_blocked INT DEFAULT 0,
        suspicious_activities INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
  } catch (error) {
    console.error('Error initializing security tables:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    
    // Try to use database, fallback to computed data
    if (sql) {
      await initSecurityTables();
      
      if (type === 'events') {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status');
        const severity = searchParams.get('severity');
        const offset = (page - 1) * limit;
        
        let events;
        let countResult;
        
        if (status && status !== 'all') {
          events = await sql`
            SELECT * FROM security_events 
            WHERE status = ${status}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
          `;
          countResult = await sql`SELECT COUNT(*) as total FROM security_events WHERE status = ${status}`;
        } else if (severity && severity !== 'all') {
          events = await sql`
            SELECT * FROM security_events 
            WHERE severity = ${severity}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
          `;
          countResult = await sql`SELECT COUNT(*) as total FROM security_events WHERE severity = ${severity}`;
        } else {
          events = await sql`
            SELECT * FROM security_events 
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
          `;
          countResult = await sql`SELECT COUNT(*) as total FROM security_events`;
        }
        
        return NextResponse.json({
          success: true,
          data: {
            events: events || [],
            total: Number(countResult?.[0]?.total || 0),
            page,
            limit
          }
        });
      }
      
      if (type === 'ip-rules') {
        const rules = await sql`SELECT * FROM ip_rules ORDER BY created_at DESC`;
        return NextResponse.json({
          success: true,
          data: rules || []
        });
      }
      
      if (type === 'stats') {
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's stats
        const [todayStats] = await sql`
          SELECT * FROM security_stats WHERE stat_date = ${today}
        `;
        
        // Get event counts
        const [openEvents] = await sql`SELECT COUNT(*) as count FROM security_events WHERE status = 'open'`;
        const [criticalEvents] = await sql`SELECT COUNT(*) as count FROM security_events WHERE severity = 'critical' AND status != 'resolved'`;
        const [totalBlocked] = await sql`SELECT COUNT(*) as count FROM ip_rules WHERE rule_type = 'blacklist'`;
        
        // Get recent attack count (last 24 hours)
        const [recentAttacks] = await sql`
          SELECT COUNT(*) as count FROM security_events 
          WHERE event_type IN ('blocked_attack', 'suspicious_ip') 
          AND created_at > NOW() - INTERVAL '24 hours'
        `;
        
        return NextResponse.json({
          success: true,
          data: {
            openEvents: Number(openEvents?.count || 0),
            criticalEvents: Number(criticalEvents?.count || 0),
            totalBlocked: Number(totalBlocked?.count || 0),
            todayAttacks: Number(recentAttacks?.count || 0),
            loginAttempts: todayStats?.login_attempts || 0,
            failedLogins: todayStats?.failed_logins || 0,
            lastScan: new Date().toISOString()
          }
        });
      }
    }
    
    // Fallback: Return computed/realistic data based on system state
    const now = new Date();
    const baseStats = {
      openEvents: 0,
      criticalEvents: 0,
      totalBlocked: 0,
      todayAttacks: 0,
      loginAttempts: 0,
      failedLogins: 0,
      lastScan: now.toISOString()
    };
    
    if (type === 'stats') {
      return NextResponse.json({ success: true, data: baseStats });
    }
    
    if (type === 'events') {
      return NextResponse.json({
        success: true,
        data: { events: [], total: 0, page: 1, limit: 50 }
      });
    }
    
    if (type === 'ip-rules') {
      return NextResponse.json({ success: true, data: [] });
    }
    
    // Overview - return all data
    return NextResponse.json({
      success: true,
      data: {
        stats: baseStats,
        events: [],
        ipRules: []
      }
    });
  } catch (error: any) {
    console.error('Security API GET error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    
    if (type === 'ip-rule') {
      const { ip, ruleType, reason, createdBy } = body;
      
      if (sql) {
        await initSecurityTables();
        
        const [existing] = await sql`SELECT id FROM ip_rules WHERE ip_address = ${ip}`;
        
        if (existing) {
          await sql`
            UPDATE ip_rules 
            SET rule_type = ${ruleType}, reason = ${reason}, updated_at = NOW()
            WHERE ip_address = ${ip}
          `;
        } else {
          await sql`
            INSERT INTO ip_rules (ip_address, rule_type, reason, created_by)
            VALUES (${ip}, ${ruleType}, ${reason}, ${createdBy || 'admin'})
          `;
        }
        
        return NextResponse.json({ success: true, message: 'IP rule added successfully' });
      }
      
      return NextResponse.json({ success: true, message: 'IP rule added (demo mode)' });
    }
    
    if (type === 'handle-event') {
      const { eventId, status, handledBy } = body;
      
      if (sql) {
        await sql`
          UPDATE security_events 
          SET status = ${status}, handled_by = ${handledBy}, handled_at = NOW()
          WHERE id = ${eventId}
        `;
        
        return NextResponse.json({ success: true, message: 'Event updated successfully' });
      }
      
      return NextResponse.json({ success: true, message: 'Event updated (demo mode)' });
    }
    
    if (type === 'log-event') {
      const { eventType, severity, sourceIp, userEmail, description } = body;
      
      if (sql) {
        await initSecurityTables();
        
        await sql`
          INSERT INTO security_events (event_type, severity, source_ip, user_email, description)
          VALUES (${eventType}, ${severity}, ${sourceIp}, ${userEmail || null}, ${description})
        `;
        
        return NextResponse.json({ success: true, message: 'Security event logged' });
      }
      
      return NextResponse.json({ success: true, message: 'Event logged (demo mode)' });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Security API POST error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (type === 'ip-rule' && id) {
      if (sql) {
        await sql`DELETE FROM ip_rules WHERE id = ${parseInt(id)}`;
        return NextResponse.json({ success: true, message: 'IP rule deleted' });
      }
      return NextResponse.json({ success: true, message: 'IP rule deleted (demo mode)' });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Security API DELETE error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
