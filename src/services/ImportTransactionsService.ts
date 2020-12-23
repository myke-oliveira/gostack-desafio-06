/* eslint-disable no-param-reassign */
import csv from 'csv-parser';
import fs from 'fs';
import {
  getCustomRepository,
  getRepository,
  In,
  PromiseUtils,
  TransactionManager,
} from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransactionData {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsData: TransactionData[] = [];
    const categoryTitles: string[] = [];

    const csvReader = fs.createReadStream(filePath).pipe(csv());

    csvReader.on('data', data => {
      const title = (data.title || data[' title']).trim();
      const type = (data.type || data[' type']).trim();
      const value = (data.value || data[' value']).trim();
      const category = (data.category || data[' category']).trim();
      const transactionData: TransactionData = { title, type, value, category };
      const categoryData: string = category;
      transactionsData.push(transactionData);
      if (!categoryTitles.includes(categoryData))
        categoryTitles.push(categoryData);
    });

    const readindDone = new Promise((resolve, reject) => {
      csvReader.on('end', () => {
        resolve('Readind Done');
      });
    });

    await readindDone;
    console.log(transactionsData);
    console.log(categoryTitles);

    const categoriesTransaction = getRepository(Category);

    const readyCategories =
      (await categoriesTransaction.find({
        where: {
          title: In(categoryTitles),
        },
      })) || [];

    const readyCategoryTitles = readyCategories.map(
      readyCategory => readyCategory.title,
    );

    const newCategoryTitles = categoryTitles.filter(
      categoryTitle => !readyCategoryTitles.includes(categoryTitle),
    );

    const newCategories = categoriesTransaction.create(
      newCategoryTitles.map(newCategoryTitle => ({
        title: newCategoryTitle,
      })),
    );

    await categoriesTransaction.save(newCategories);

    const allCategories = [...newCategories, ...readyCategories];

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = transactionsRepository.create(
      transactionsData.map(
        ({ title, type, value, category: categoryTitle }) => {
          return {
            title,
            type,
            value,
            category: allCategories.find(
              category => category.title === categoryTitle,
            ),
          };
        },
      ),
    );

    await transactionsRepository.save(transactions);

    fs.unlink(filePath, () => {
      console.log(`${filePath} deleted!`);
    });

    return transactions;
  }
}

export default ImportTransactionsService;
