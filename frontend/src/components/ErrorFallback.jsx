function ErrorFallback({
  message = "Dati non disponibili per questa sezione",
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
      {message}
    </div>
  );
}

export default ErrorFallback;
