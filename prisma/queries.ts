import "dotenv/config"
import { prisma } from "../lib/prisma"


async function createEvent() {
  const event = await prisma.event.create({
    data: {
      title: "WEB DEV",
      slug: "learn-how-to-code-flutter-beginner-workshop",
      description: "This is an Flutter beginner workshop.",
      date: new Date("2025-01-20"),
      mode: "OFFLINE",
      status: "UPCOMING",

      meetingUrl: "https://zoom.us/react",
      startDate: new Date("2025-01-20T10:00:00Z"),
      endDate: new Date("2025-01-20T13:00:00Z"),

      capacity: 50,
    },
  })

  console.log("Event created:", event)
}

async function main() {
  await createEvent()
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
