import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Picking } from "../picking/model";
import { User } from "../user/model";
import { Participant } from "../participant/model";

// inactive 未对外开放的活动，不能参加
// enrolling 阶段允许用户加入，用户完善资料也在此阶段
// choosing 互选
// matching 公布互选结果，并进行反选和坚持
// result 获得最终配对结果，包括互选，反选，坚持确认后的最终结果
type Phase = "inactive" | "enrolling" | "choosing" | "matching" | "result";

@Entity()
class MatchingEvent {
  static init({
    title,
    startChoosingAt,
    phase,
  }: Pick<MatchingEvent, "title" | "startChoosingAt" | "phase">) {
    const matchingEvent = new MatchingEvent();
    matchingEvent.title = title;
    matchingEvent.startChoosingAt = startChoosingAt;
    matchingEvent.phase = phase;

    return matchingEvent;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", default: "inactive" })
  phase: Phase = "inactive";

  @Column({ type: "timestamp" })
  startChoosingAt: Date;

  @Column({ type: "varchar" })
  title: string;

  @OneToMany(() => Picking, (picking) => picking.matchingEvent)
  pickings: Picking[];

  @OneToMany(() => Participant, (participant) => participant.matchingEvent)
  participants: Participant[];

  setPhase(phase: Phase) {
    this.phase = phase;
  }
}

export { MatchingEvent, Phase };
