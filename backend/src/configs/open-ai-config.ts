import { Configuration } from "openai"

export const configureOpenAI = () => {
    const config = new Configuration({
        apiKey:  process.env.GROQ_API_KEY,
        basePath: "https://api.groq.com/openai/v1"
    })
    return config
}