import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-row-reverse">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm md:w-96">
         
            <div className="mt-10">
              <div>
                <form
                  action="/request-password-reset"
                  method="POST"
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Enter your email address"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-color sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-secondary-color px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary-color focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-color"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </div>
              <p className="mt-2 flex flex-row justify-end text-sm leading-6 text-gray-500 mt-5">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-secondary-color hover:text-secondary-color"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            loading="lazy"
            alt=""
            src="/src/assets/images/bg6.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
