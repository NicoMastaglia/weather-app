function notFoundHandler(_request, response) {
  response.status(404).json({
    success: false,
    message: "Endpoint non trovato",
  });
}

function globalErrorHandler(error, _request, response, _next) {
  console.error(error);

  response.status(500).json({
    success: false,
    message: "Errore interno del server",
  });
}

module.exports = { notFoundHandler, globalErrorHandler };
