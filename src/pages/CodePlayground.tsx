import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

const defaultCode = `// Welcome to the AI Teacher Code Playground
// Start coding here...

function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`

export function CodePlayground() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value)
  }

  const runCode = async () => {
    setIsRunning(true)
    try {
      // Create a safe environment for code execution
      const consoleLog = []
      const context = {
        console: {
          log: (...args: any[]) => {
            consoleLog.push(args.map(arg => String(arg)).join(' '))
          },
        },
      }

      // Execute the code
      const fn = new Function('context', `
        with (context) {
          ${code}
        }
      `)
      
      fn(context)
      setOutput(consoleLog.join('\n'))
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Code Playground</h1>
        <Button onClick={runCode} disabled={isRunning}>
          {isRunning ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Icons.play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="min-h-[500px]">
          <Editor
            height="500px"
            defaultLanguage="javascript"
            defaultValue={defaultCode}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </Card>

        <Card className="min-h-[500px] p-4">
          <h2 className="mb-4 text-lg font-semibold">Output</h2>
          <pre className="h-[440px] overflow-auto rounded-lg bg-secondary p-4 font-mono text-sm">
            {output || 'Run your code to see the output...'}
          </pre>
        </Card>
      </div>
    </div>
  )
} 