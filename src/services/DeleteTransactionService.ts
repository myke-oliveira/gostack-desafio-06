import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { affected } = await transactionsRepository.delete({ id });

    if (affected === 0) {
      throw new AppError('Not Found!', 400);
    }
  }
}

export default DeleteTransactionService;
