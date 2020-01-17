export  default class InteractionModel {

 public description: string;
 public value: any;
 public type: number;

 public static get TYPE_NONE():number { return 0; }
 public static get TYPE_MESH():number { return 1; }
 
}