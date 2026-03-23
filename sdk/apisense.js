export async function trackAPI(data) {
  await fetch("http://localhost:3000/api/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

// Usage Example:
/*
trackAPI({
  provider: "openai",
  model: "gpt-4",
  tokens_input: 1000,
  tokens_output: 500,
  latency: 300,
  status: "success"
})
*/
