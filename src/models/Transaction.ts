import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import Category from "./Category";

@Entity('transactions')
class Transaction {
  @Column()
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
