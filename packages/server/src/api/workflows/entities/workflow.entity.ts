import { Account } from '@/api/accounts/entities/accounts.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Segment } from '../../segments/entities/segment.entity';

export enum TriggerType {
  EVENT = 'eventBased',
  TIME_DELAY = 'timeDelay',
  TIME_WINDOW = 'timeWindow',
}

export interface IEventConditions {
  value: any;
  attribute?: string;
  condition?: string;
  key?: string;
  type?: string;
  comparisonType?: string;
  relationWithNext?: 'and' | 'or';
  isArray?: boolean;
}

export class EventProps {
  conditions: IEventConditions[];
  eventTime?: string;
  delayTime?: string;
  specificTime?: string;
  fromTime?: string;
  toTime?: string;
}

export enum ProviderTypes {
  Posthog = 'posthog',
  Custom = 'custom',
}
export enum PosthogTriggerParams {
  Track = 'track',
  Page = 'page',
  Rageclick = 'Rageclick',
  Typed = 'Typed (Change)',
  Autocapture = 'Autocapture (Click)',
  Submit = 'Submit',
  Pageview = 'Pageview',
  Pageleave = 'Pageleave',
}

export class Trigger {
  id: string;
  title: string;
  type: TriggerType | TriggerType;
  source?: string;
  dest?: string[];
  providerType?: ProviderTypes;
  providerParams?: PosthogTriggerParams;
  properties?: EventProps;
}

export interface Edge {
  id: string;
  type: 'smoothstep';
  source: string;
  target: string;
  markerEnd: {
    type: string;
    width: number;
    height: number;
    strokeWidth: number;
  };
  sourceHandle: string;
  targetHandle: string | null;
}

export interface Node {
  id: string;
  data: {
    nodeId: string;
    primary: boolean;
    messages: string[];
    triggers: Trigger[];
    audienceId: string;
    isSelected: boolean;
    needsUpdate: boolean;
    dataTriggers?: Trigger[];
  };
  type: string;
  width: number;
  height: number;
  dragging: boolean;
  position: {
    x: number;
    y: number;
  };
  selected: boolean;
  positionAbsolute: {
    x: number;
    y: number;
  };
}

export interface VisualLayout {
  edges: Edge[];
  nodes: Node[];
}

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name: string;

  @JoinColumn()
  @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
  owner: Account;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column('boolean', { default: false })
  isPaused: boolean;

  @Column('boolean', { default: false })
  isStopped: boolean;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('timestamp', { nullable: true })
  latestPause?: Date;

  //This is actually an array of JSON stringified Trigger objects
  @Column('simple-array', { nullable: true })
  rules: string[];

  // {"nodes":[...list of nodes], "edges": [...list of edges]}
  @Column('jsonb', { nullable: true })
  visualLayout: VisualLayout;

  @Column({ default: true })
  isDynamic: boolean;

  @ManyToOne(() => Segment, (segment) => segment.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  segment?: Segment;
}
