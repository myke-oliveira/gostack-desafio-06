import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (partialBalance, transaction) => {
        switch (transaction.type) {
          case 'income':
            partialBalance.income += Number(transaction.value);
            break;
          case 'outcome':
            partialBalance.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return partialBalance;
      },
      { income: 0, outcome: 0 },
    );
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
