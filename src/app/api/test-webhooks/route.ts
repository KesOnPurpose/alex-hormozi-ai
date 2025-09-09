import { NextRequest, NextResponse } from 'next/server'

// Webhook configuration for all agents
const WEBHOOKS = {
  'master-conductor': process.env.N8N_MASTER_CONDUCTOR,
  'constraint-analyzer': process.env.N8N_CONSTRAINT_ANALYZER,
  'offer-analyzer': process.env.N8N_OFFER_ANALYZER,
  'financial-calculator': process.env.N8N_FINANCIAL_CALCULATOR,
  'money-model-architect': process.env.N8N_MONEY_MODEL_ARCHITECT,
  'psychology-optimizer': process.env.N8N_PSYCHOLOGY_OPTIMIZER,
  'implementation-planner': process.env.N8N_IMPLEMENTATION_PLANNER,
  'coaching-methodology': process.env.N8N_COACHING_METHODOLOGY
}

export async function GET() {
  try {
    const testQuery = "Test connection from Alex Hormozi AI platform"
    const testPayload = {
      query: testQuery,
      businessContext: {
        industry: "test",
        currentRevenue: 10000,
        customerCount: 100,
        businessStage: "startup"
      },
      sessionType: "diagnostic",
      userId: "test-user"
    }

    const results: Record<string, any> = {}

    // Test each webhook
    for (const [agentName, webhookUrl] of Object.entries(WEBHOOKS)) {
      if (!webhookUrl) {
        results[agentName] = {
          success: false,
          error: 'Webhook URL not configured',
          url: 'Missing'
        }
        continue
      }

      try {
        const startTime = Date.now()
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testPayload),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        const executionTime = Date.now() - startTime

        if (response.ok) {
          const data = await response.json()
          results[agentName] = {
            success: true,
            status: response.status,
            executionTime,
            url: webhookUrl,
            response: data
          }
        } else {
          results[agentName] = {
            success: false,
            status: response.status,
            error: `HTTP ${response.status}`,
            executionTime,
            url: webhookUrl
          }
        }
      } catch (error) {
        results[agentName] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          url: webhookUrl
        }
      }
    }

    // Calculate summary stats
    const totalWebhooks = Object.keys(WEBHOOKS).length
    const successfulWebhooks = Object.values(results).filter(r => r.success).length
    const averageResponseTime = Object.values(results)
      .filter((r: any) => r.executionTime)
      .reduce((sum: number, r: any) => sum + r.executionTime, 0) / successfulWebhooks || 0

    return NextResponse.json({
      success: true,
      summary: {
        total: totalWebhooks,
        successful: successfulWebhooks,
        failed: totalWebhooks - successfulWebhooks,
        successRate: Math.round((successfulWebhooks / totalWebhooks) * 100),
        averageResponseTime: Math.round(averageResponseTime)
      },
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentName, query, businessContext } = body

    if (!agentName || !WEBHOOKS[agentName as keyof typeof WEBHOOKS]) {
      return NextResponse.json({
        success: false,
        error: `Invalid agent name: ${agentName}`,
        availableAgents: Object.keys(WEBHOOKS)
      }, { status: 400 })
    }

    const webhookUrl = WEBHOOKS[agentName as keyof typeof WEBHOOKS]
    if (!webhookUrl) {
      return NextResponse.json({
        success: false,
        error: `Webhook URL not configured for ${agentName}`
      }, { status: 400 })
    }

    const payload = {
      query: query || "Test query",
      businessContext: businessContext || {
        industry: "test",
        businessStage: "startup"
      },
      sessionType: "diagnostic",
      userId: "test-user"
    }

    const startTime = Date.now()
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    const executionTime = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        agent: agentName,
        executionTime,
        data
      })
    } else {
      return NextResponse.json({
        success: false,
        agent: agentName,
        error: `HTTP ${response.status}`,
        executionTime
      }, { status: response.status })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}