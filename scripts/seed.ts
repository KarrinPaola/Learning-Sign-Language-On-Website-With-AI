import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

import * as schema from "../db/schema"

const sql = neon(process.env.DATABASE_URL!)
//@ts-ignore
const db = drizzle(sql, { schema })

const main = async () => {
    try {
        console.log("Seeding database")

        await db.delete(schema.courses)
        await db.delete(schema.userProgress)
        await db.delete(schema.units)
        await db.delete(schema.lessons)
        await db.delete(schema.challenges)
        await db.delete(schema.challengeOptions)
        await db.delete(schema.challengeProgress)


        await db.insert(schema.courses).values([

            {
                id: 1,
                title: "Vietnamese",
                imageSrc: "/VN - Vietnam.svg"
            },
            {
                id: 2,
                title: "Chinese",
                imageSrc: "/CN - China.svg"
            },
            {
                id: 3,
                title: "German",
                imageSrc: "/DE - Germany.svg"
            },
            {
                id: 4,
                title: "French",
                imageSrc: "/FR - France.svg"
            },
            {
                id: 5,
                title: "English",
                imageSrc: "/GB-UKM - United Kingdom.svg"
            }
        ])

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 5, //ENG
                title: "Unit 1",
                description: "Sign language alphabet",
                order: 1,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1, //Bảng chữ cái trong ngôn ngữ kí hiệu
                order: 1,
                title: "The letters"
            },
            {
                id: 2,
                unitId: 1, //Bảng chữ cái trong ngôn ngữ kí hiệu
                order: 2,
                title: "The number"
            },
        ])

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: `What is the way to describe the letter "A"?`
            },
            {
                id: 2,
                lessonId: 1,
                type: "ASSIST",
                order: 2,
                question: `"B"`
            },
            {
                id: 3,
                lessonId: 1,
                type: "SELECT",
                order: 3,
                question: `What is the way to describe the letter "C"?`
            }
        ])

        await db.insert(schema.challengeOptions).values([
            {

                challengeId: 1,
                imageSrc: "/a.svg",
                correct: true,
                text: "",
                audioSrc: ""
            },
            {

                challengeId: 1,
                imageSrc: "/b.svg",
                correct: false,
                text: "",
                audioSrc: ""
            },
            {

                challengeId: 1,
                imageSrc: "/c.svg",
                correct: false,
                text: "",
                audioSrc: ""
            }
        ])

        await db.insert(schema.challengeOptions).values([
            {

                challengeId: 2,
                imageSrc: "/a.svg",
                correct: false,
                text: "",
                audioSrc: ""
            },
            {

                challengeId: 2,
                imageSrc: "/b.svg",
                correct: true,
                text: "",
                audioSrc: ""
            },
            {

                challengeId: 2,
                imageSrc: "/c.svg",
                correct: false,
                text: "",
                audioSrc: ""
            }
        ])

        await db.insert(schema.challengeOptions).values([
            {

                challengeId: 3,
                imageSrc: "/a.svg",
                correct: false,
                text: "",
                audioSrc: ""
            },
            {

                challengeId: 3,
                imageSrc: "/b.svg",
                correct: false,
                text: "",
                audioSrc: ""
            },
            {

                challengeId: 3,
                imageSrc: "/c.svg",
                correct: true,
                text: "",
                audioSrc: ""
            }
        ])

        console.log("Seeding finished")
    } catch (error) {
        console.error(error)
        throw new Error("Failed to seed the database")
    }
}

main()