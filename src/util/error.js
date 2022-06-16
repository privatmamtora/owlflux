export class CustomError extends Error {
  constructor(message, title = null) {
    super(message);
    if (title) {
      this.title = title;
    }
  }
}