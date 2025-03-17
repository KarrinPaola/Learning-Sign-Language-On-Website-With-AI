"use client"

import { challenges, lessons, userSubscription } from "@/db/schema";
import { challengeOptions } from '../../db/schema';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeprogress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import Image from 'next/image';
import Confetti from 'react-confetti';
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useWindowSize, useMount } from "react-use";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePractiseModal } from "@/store/use-practise-modal";

// Định nghĩa kiểu dữ liệu cho props của component Quiz
type Props = {
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    initialHearts: number;
    initialPercentage: number;
    userSubscription: typeof userSubscription.$inferSelect & { isActive: boolean } | null;
}

// Component Quiz để hiển thị bài kiểm tra
export const Quiz = ({
    initialLessonId,
    initialLessonChallenges,
    initialHearts,
    initialPercentage,
    userSubscription,
}: Props) => {
    // Sử dụng store để mở modal khi hết trái tim hoặc cần luyện tập
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPractiseModal } = usePractiseModal();

    // Khi component được mount, kiểm tra nếu đã hoàn thành 100% thì mở modal luyện tập
    useMount(() => {
        if (initialPercentage === 100) openPractiseModal();
    });

    // Lấy kích thước cửa sổ để hiển thị Confetti
    const { width, height } = useWindowSize();
    const router = useRouter();
    const [pending, startTransition] = useTransition(); // Quản lý trạng thái chờ khi thực hiện action
    const [lessonId] = useState(initialLessonId); // ID bài học hiện tại
    const [hearts, setHearts] = useState(initialHearts); // Số trái tim hiện tại
    const [percentage, setPercentage] = useState(() => initialPercentage === 100 ? 0 : initialPercentage); // Phần trăm hoàn thành, reset về 0 nếu đã hoàn thành trước đó
    const [challenges] = useState(initialLessonChallenges); // Danh sách các thử thách
    const [activeIndex, setActiveIndex] = useState(() => {
        // Tìm thử thách chưa hoàn thành đầu tiên để bắt đầu từ đó
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>(); // Lựa chọn hiện tại của người dùng (dành cho câu hỏi chọn đáp án)
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none"); // Trạng thái câu trả lời
    const [capturedImage, setCapturedImage] = useState<string | null>(null); // Lưu ảnh chụp từ camera (dành cho câu hỏi loại ACTION)
    const videoRef = useRef<HTMLVideoElement>(null); // Tham chiếu đến thẻ video để hiển thị camera
    const canvasRef = useRef<HTMLCanvasElement>(null); // Tham chiếu đến canvas để chụp ảnh từ video

    const challenge = challenges[activeIndex]; // Thử thách hiện tại
    const options = challenge?.challengeOptions ?? []; // Các lựa chọn của thử thách

    // Mở camera khi thử thách có type là "ACTION"
    useEffect(() => {
        if (challenge?.type === "ACTION" && videoRef.current) {
            // Yêu cầu quyền truy cập camera
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) videoRef.current.srcObject = stream; // Gán stream từ camera vào video
                })
                .catch((err) => toast.error("Không thể truy cập camera: " + err.message)); // Báo lỗi nếu không truy cập được
        }
        // Cleanup: Tắt camera khi component unmount hoặc thay đổi thử thách
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop()); // Dừng tất cả track của stream
            }
        };
    }, [activeIndex, challenge?.type]);

    // Chuyển sang thử thách tiếp theo
    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    // Xử lý khi người dùng chọn một lựa chọn (dành cho câu hỏi không phải ACTION)
    const onSelect = (id: number) => {
        if (status !== "none" || challenge.type === "ACTION") return; // Không cho chọn nếu đã trả lời hoặc là câu ACTION
        setSelectedOption(id);
    };

    // Chụp ảnh từ camera
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                // Vẽ frame từ video lên canvas
                context.drawImage(videoRef.current, 0, 0, 640, 480);
                // Chuyển canvas thành dữ liệu ảnh dạng base64
                const imageData = canvasRef.current.toDataURL("image/jpeg");
                setCapturedImage(imageData); // Lưu ảnh chụp
            }
        }
    };

    // Hàm gửi ảnh lên API và nhận kết quả
    const checkActionResult = async (imageData: string): Promise<boolean> => {
        try {
            // Chuyển base64 thành Blob để gửi qua API
            const base64String = imageData.split(',')[1]; // Loại bỏ phần "data:image/jpeg;base64,"
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/jpeg" });

            // Tạo FormData để gửi file
            const formData = new FormData();
            formData.append("file", blob, "captured_image.jpg");

            // Gửi yêu cầu POST tới API
            const response = await fetch("https://getprediction-363786230400.asia-northeast1.run.app", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("API request failed");

            const result = await response.json();
            const predictedText = result.prediction; // Ví dụ: "W"

            // So sánh với expectedActionResult
            return predictedText === challenge.expectedActionResult;
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Không thể kiểm tra ảnh: " + error.message);
            } else {
                toast.error("Không thể kiểm tra ảnh: Unknown error");
            }
            return false; // Mặc định sai nếu có lỗi
        }
    };

    // Xử lý khi nhấn nút "Tiếp tục"
    const onContinue = () => {
        // Nếu chưa có lựa chọn hoặc ảnh chụp (tùy loại câu hỏi), không làm gì
        if (challenge.type === "ACTION" && !capturedImage) return;
        if (challenge.type !== "ACTION" && !selectedOption) return;

        // Nếu đã trả lời đúng hoặc sai trước đó, reset và chuyển tiếp
        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            setCapturedImage(null); // Reset ảnh chụp nếu có
            return;
        }
        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            setCapturedImage(null); // Reset ảnh chụp nếu có
            return;
        }

        // Xử lý khi chưa có trạng thái (chưa trả lời)
        if (challenge.type === "ACTION") {
            startTransition(async () => {
                // Gửi ảnh lên API và kiểm tra kết quả
                const isCorrect = await checkActionResult(capturedImage!);

                if (isCorrect) {
                    setStatus("correct");
                    setPercentage((prev) => prev + 100 / challenges.length);
                    upsertChallengeprogress(challenge.id).catch(() => toast.error("Không thể cập nhật tiến trình"));
                    if (initialPercentage === 100) setHearts((prev) => Math.min(prev + 1, 5));
                    onNext();
                    setStatus("none");
                    setCapturedImage(null);
                } else {
                    reduceHearts(challenge.id)
                        .then((response) => {
                            if (response?.error === "hearts") openHeartsModal();
                            else setHearts((prev) => Math.max(prev - 1, 0));
                            setStatus("wrong");
                        })
                        .catch(() => toast.error("Có lỗi xảy ra. Vui lòng thử lại"));
                }
            });
        } else {
            const correctOption = options.find((option) => option.correct); // Tìm đáp án đúng
            if (!correctOption) return;

            if (correctOption.id === selectedOption) { // Nếu chọn đúng
                startTransition(() => {
                    upsertChallengeprogress(challenge.id) // Cập nhật tiến trình
                        .then((response) => {
                            if (response?.error === "hearts") {
                                openHeartsModal(); // Mở modal nếu hết trái tim
                                return;
                            }
                            setStatus("correct");
                            setPercentage((prev) => prev + 100 / challenges.length); // Tăng phần trăm
                            if (initialPercentage === 100) setHearts((prev) => Math.min(prev + 1, 5)); // Tăng trái tim nếu luyện tập
                            onNext(); // Chuyển sang câu tiếp theo ngay khi đúng
                            setStatus("none"); // Reset trạng thái
                            setSelectedOption(undefined); // Reset lựa chọn
                        })
                        .catch(() => toast.error("Có lỗi xảy ra. Vui lòng thử lại."));
                });
            } else { // Nếu chọn sai
                startTransition(() => {
                    reduceHearts(challenge.id) // Giảm trái tim
                        .then((response) => {
                            if (response?.error === "hearts") openHeartsModal(); // Mở modal nếu hết trái tim
                            else setHearts((prev) => Math.max(prev - 1, 0)); // Giảm trái tim
                            setStatus("wrong");
                        })
                        .catch(() => toast.error("Có lỗi xảy ra. Vui lòng thử lại"));
                });
            }
        }
    };

    // Nếu không còn thử thách, hiển thị màn hình hoàn thành
    if (!challenge) {
        return (
            <>
                <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={10000} />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image src="/lingo-emotional.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
                    <Image src="/lingo-emotional.svg" alt="Finish" className="block lg:hidden" height={50} width={50} />
                    <h1 className="text-lg lg:text-2xl text-center font-bold text-neutral-700">
                        Chúc mừng! <br /> Bạn đã hoàn thành bài học.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard variant="points" value={challenges.length * 10} /> {/* Hiển thị điểm */}
                        <ResultCard variant="hearts" value={hearts} /> {/* Hiển thị số trái tim */}
                    </div>
                </div>
                <Footer lessonId={lessonId} status="completed" onCheck={() => router.push("/learn")} /> {/* Chuyển về trang học */}
            </>
        );
    }

    // Tiêu đề câu hỏi, tùy thuộc vào loại thử thách
    const title = challenge.type === "ASSIST"
        ? "Chọn nghĩa đúng"
        : challenge.question ?? "Xác định điều này";

    // Giao diện chính của bài kiểm tra
    return (
        <>
            <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <div className="flex flex-col gap-y-4">
                            {/* Hiển thị ảnh nếu challenge có imageSrc */}
                            {challenge.imageSrc && (
                                <div className="flex justify-center lg:justify-start">
                                    <Image
                                        src={challenge.imageSrc}
                                        alt="Question Image"
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                            {/* Hiển thị tiêu đề nếu có */}
                            {title && (
                                <h1 className="text-lg lg:text-2xl text-center lg:text-start font-bold text-neutral-700">
                                    {title}
                                </h1>
                            )}
                        </div>
                        <div>
                            {/* Hiển thị QuestionBubble cho loại ASSIST */}
                            {challenge.type === "ASSIST" && <QuestionBubble question={challenge.question} />}

                            {/* Xử lý giao diện cho loại ACTION */}
                            {challenge.type === "ACTION" ? (
                                <div className="flex flex-col gap-y-4 items-center">
                                    <video ref={videoRef} autoPlay width={640} height={480} className="rounded-lg" /> {/* Hiển thị camera */}
                                    <canvas ref={canvasRef} width={640} height={480} className="hidden" /> {/* Canvas ẩn để chụp ảnh */}
                                    {!capturedImage && (
                                        <button
                                            onClick={captureImage}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                            disabled={pending}
                                        >
                                            Chụp ảnh
                                        </button>
                                    )}
                                    {/* Hiển thị ảnh đã chụp */}
                                    {capturedImage && (
                                        <Image
                                            src={capturedImage}
                                            alt="Captured Action"
                                            width={200}
                                            height={200}
                                            className="rounded-lg"
                                        />
                                    )}
                                </div>
                            ) : (
                                /* Hiển thị các lựa chọn cho câu hỏi không phải ACTION */
                                <Challenge
                                    options={options}
                                    onSelect={onSelect}
                                    status={status}
                                    selectedOption={selectedOption}
                                    disabled={pending}
                                    type={challenge.type}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || (challenge.type !== "ACTION" && !selectedOption) || (challenge.type === "ACTION" && !capturedImage)} // Vô hiệu hóa nếu chưa chọn hoặc chưa chụp ảnh
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};