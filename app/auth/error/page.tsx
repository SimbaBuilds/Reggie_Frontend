"use client"

import { useSearchParams } from "next/navigation"

const ErrorPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div>
      <h1>Error</h1>
      <p>{error ? error : 'An unknown error occurred.'}</p>
      <a href="/">Go back to home</a>
    </div>
  )
}

export default ErrorPage
