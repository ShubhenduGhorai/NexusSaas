import OpenAI from "openai"

export function createTrackedOpenAI(apiKey, userId) {
  const openai = new OpenAI({ apiKey })

  return {
    chat: {
      completions: {
        create: async (params) => {
          const start = Date.now()

          try {
            const response = await openai.chat.completions.create(params)

            const end = Date.now()
            const latency = end - start

            const tokens_input = response.usage?.prompt_tokens || 0
            const tokens_output = response.usage?.completion_tokens || 0

            await fetch("http://localhost:3000/api/log", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                provider: "openai",
                model: params.model,
                tokens_input,
                tokens_output,
                latency,
                status: "success"
              })
            })

            return response
          } catch (error) {
            const end = Date.now()

            await fetch("http://localhost:3000/api/log", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                provider: "openai",
                model: params.model,
                tokens_input: 0,
                tokens_output: 0,
                latency: end - start,
                status: "error"
              })
            })

            throw error
          }
        }
      }
    }
  }
}
