import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper"
import { UserProgess } from "@/components/user-progress"
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries"
import { redirect } from "next/navigation";
import Image from 'next/image';
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const LeaderboardPage = async () => {

    const userProgressData = getUserProgress()
    const userSubscriptionData = getUserSubscription();
    const leaderboardData = getTopTenUsers();

    const [userProgress, userSubscription, leaderboard] = await Promise.all([
        userProgressData,
        userSubscriptionData,
        leaderboardData
    ])

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses")
    }

    const isPro = !!userSubscription?.isActive;
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgess
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isPro}
                />
                {!isPro && (
                    <Promo />
                )}
                <Quests points={userProgress.points}/>
            </StickyWrapper>
            <FeedWrapper>
                <div className="flex flex-col w-full items-center">
                    <Image
                        src={"/leaderboard.svg"}
                        alt="leaderboard"
                        width={90}
                        height={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Leaderboard
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Check out the top performers!
                    </p>
                    <Separator className="mb-4 h-0.5 rounded-full" />
                    {
                        leaderboard.map((userProgress, index) => {
                            return (
                                <div
                                    key={userProgress.userId}
                                    className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-green-200/50"
                                >
                                    <p className="font-bold text-lime-700 mr-4">
                                        {index + 1}
                                    </p>
                                    <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                                        <AvatarImage
                                            className="object-cover"
                                            src={userProgress.userImageSrc}
                                        />
                                    </Avatar>
                                    <p className="flex-1 font-bold text-neutral-800">
                                        {userProgress.userName}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {userProgress.points}
                                    </p>
                                </div>
                            )
                        })
                    }

                </div>
            </FeedWrapper>
        </div>
    )
}

export default LeaderboardPage