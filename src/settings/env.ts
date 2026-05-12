import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().optional(),
})

type EnvSchema = z.infer<typeof envSchema>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}

const parsedEnv = envSchema.parse(process.env)
process.env = Object.create({ ...process.env, ...parsedEnv })
