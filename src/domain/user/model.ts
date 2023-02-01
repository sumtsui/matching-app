import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Photo } from "../photo/model";

type Gender = "male" | "female";

export type UserInitParams = Pick<
  User,
  "age" | "name" | "bio" | "gender" | "phoneNumber" | "jobTitle"
>;

@Entity()
export class User {
  static init({
    name,
    age,
    bio,
    gender,
    phoneNumber,
    jobTitle,
  }: UserInitParams) {
    const user = new User();
    user.name = name;
    user.age = age;
    user.bio = bio;
    user.gender = gender;
    user.phoneNumber = phoneNumber;
    user.jobTitle = jobTitle;

    return user;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  gender: Gender;

  @Column({ type: "varchar", nullable: false })
  phoneNumber: string;

  @Column({ type: "int", nullable: false })
  age: number;

  @Column({ type: "varchar", nullable: false })
  jobTitle: string;

  @Column({ type: "varchar", nullable: true })
  wechatId: string;

  @Column({ type: "jsonb", default: "{}" })
  bio: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
