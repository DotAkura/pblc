export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-center">Sorry, the page you are looking for does not exist.</p>
        <a href="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Return to Home
        </a>
      </div>
    </div>
  )
}

