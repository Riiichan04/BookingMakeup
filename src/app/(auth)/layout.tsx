// import { imageLoader } from "@/common/utils/image-loader";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="bg-neutral-50 h-screen hidden lg:flex flex-2 relative shrink-0">
                <Image
                    sizes="100vw"
                    src={`https://images.unsplash.com/photo-1676570092589-a6c09ecbb373?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                    alt="Login media"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto py-6 px-6 sm:px-8">
                <div className="flex min-h-full flex-col justify-center">
                    {children}
                </div>
            </div>
        </div>
    )
}