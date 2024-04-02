const AppError = require('./AppError');

describe('AppError', () => {
  it('AppError é uma instancia de AppError', () => {
    const appError = new AppError('mensagem de erro');
    expect(appError).toBeInstanceOf(AppError);
  });

  it('AppError contem a mensagem de erro correta', () => {
    const appError = new AppError('mensagem de erro');
    expect(appError.message).toBe('mensagem de erro');
  });
});
