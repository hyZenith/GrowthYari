import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Link href="/">
                            <Image
                                alt="GrowthYari"
                                src="/images/logo.png"
                                width={56}
                                height={56}
                                className="h-14 w-14 rounded-full object-cover"
                            />
                        </Link>
                        <span className="font-serif text-xl italic text-emerald-600">GrowthYari</span>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 text-center">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 text-center">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-6">
                        <form action="#" method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-900">
                                    Full name
                                </label>
                                <div className="mt-2">
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="Rakesh Sharma"
                                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="example@gmail.com"
                                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-900">
                                    Phone number
                                </label>
                                <div className="mt-2">
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        placeholder="+91 9876543210"
                                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Password"
                                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium">
                                    <span className="bg-white px-4 text-slate-500">OR</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <a
                                    href="#"
                                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                                >
                                    <svg className="h-7 w-7" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M12.0003 20.45C16.667 20.45 20.5836 16.5333 20.5836 11.8667C20.5836 7.2 16.667 3.28333 12.0003 3.28333C7.33366 3.28333 3.41699 7.2 3.41699 11.8667C3.41699 16.5333 7.33366 20.45 12.0003 20.45Z" fill="currentColor" fillOpacity="0.2" />
                                        <path d="M16.292 11.8667C16.292 11.6334 16.2753 11.4 16.242 11.1834H12.0003V12.9167H14.417C14.3087 13.4834 14.0003 13.9667 13.5253 14.2834V15.4167H14.9753C15.8253 14.6334 16.292 13.4834 16.292 11.8667Z" fill="#4285F4" />
                                        <path d="M12.0003 16.2334C13.2087 16.2334 14.217 15.8334 14.9753 15.1417L13.5253 14.0084C13.1253 14.275 12.6086 14.4417 12.0003 14.4417C10.8336 14.4417 9.85033 13.6584 9.50033 12.6084H8.00033V13.7667C8.75033 15.2584 10.2837 16.2334 12.0003 16.2334Z" fill="#34A853" />
                                        <path d="M9.50033 12.6083C9.40866 12.3333 9.35866 12.0417 9.35866 11.7417C9.35866 11.4417 9.40866 11.15 9.50033 10.875V9.71667H8.00033C7.692 10.3333 7.517 11.025 7.517 11.7417C7.517 12.4583 7.692 13.15 8.00033 13.7667L9.50033 12.6083Z" fill="#FBBC05" />
                                        <path d="M12.0003 9.04169C12.6587 9.04169 13.2503 9.26669 13.717 9.70835L15.0087 8.41669C14.2087 7.67502 13.192 7.25002 12.0003 7.25002C10.2837 7.25002 8.75033 8.22502 8.00033 9.71669L9.50033 10.875C9.85033 9.82502 10.8336 9.04169 12.0003 9.04169Z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm font-semibold text-slate-700">Continue with Google</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
