interface ErrorFallbackProps {
  error: Error;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="text-red-500">
      <p className="text-15 font-bold">Something went wrong:</p>
      <p className="mt-5 italic">
        <span className="font-bold">({error.name}):</span>
        {error.message}
      </p>
    </div>
  );
}

export default ErrorFallback;
