export type Submission = {
    id: string
    brandName: string
    amount: number
    currency: string
    platform: string
    category: string
    followerCount: number
    createdAt: Date
    description: string | null
  }

export const EmptySubmission: Submission = {
    id: "0",
    brandName: "test",
    amount: 0,
    currency: "USD",
    platform: "Youtube",
    category: "test",
    followerCount: 0,
    createdAt: new Date(),
    description: "test"
}