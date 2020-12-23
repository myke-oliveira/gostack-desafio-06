import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity('categories')
class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
