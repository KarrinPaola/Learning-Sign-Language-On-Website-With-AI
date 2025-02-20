"use client"

import { courses, userProgress } from '@/db/schema';
import { Card } from './card';
import { startTransition, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertUserProgress } from '@/actions/user-progress';
import { on } from 'events';
import { toast } from 'sonner';


type Props = {
    courses: typeof courses.$inferSelect[];
    activeCoursesId?: typeof userProgress.$inferSelect['activeCourseId'];
}

export const List = ({ courses, activeCoursesId }: Props) => {
    const router = useRouter();
    const [pending, setPending] = useTransition();
    const onClick = (id: number) => {
        if(pending) return;
        if(activeCoursesId === id) return router.push('/learn');
        startTransition(() => {
            upsertUserProgress(id)
            .catch(() => toast.error("Something went wrong"))
        })
    }
    return (
        <div className='pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4'>
            {courses.map(
                (course) => (
                    <Card
                        key = {course.id}
                        id = {course.id}
                        title = {course.title}
                        imageSrc = {course.imageSrc}
                        onclick = {onClick}
                        disabled = {pending}
                        active = {course.id === activeCoursesId}
                    />
                )
            )}
        </div>
    )
}