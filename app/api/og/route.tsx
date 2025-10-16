import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'WhatToDo List'
    const handle = searchParams.get('handle') || 'user'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#11211f',
            padding: 60,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <svg
              style={{ color: '#18b9a9' }}
              height="48"
              viewBox="0 0 256 256"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M148 64a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm-12 52a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm-80-92v-4a8 8 0 0 1 16 0v4h112v-4a8 8 0 0 1 16 0v4a24 24 0 0 1 24 24v88a24 24 0 0 1-24 24H40a24 24 0 0 1-24-24v-88a24 24 0 0 1 24-24Zm160 24H40v88h160Z"
                fill="currentColor"
              />
            </svg>
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              WhatToDo
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#94c7c2',
              }}
            >
              by @{handle}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

