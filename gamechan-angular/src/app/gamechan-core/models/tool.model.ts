import { Map } from '../motor/map';

export default class ToolModel {

    public type: any;
    public desc: string;
    public property: any;

    constructor(type_,property_,desc_){
        this.type = type_;
        this.property = property_;
        this.desc = desc_;
    }

    //All the tools
    public static LIST_TOOLS : ToolModel[] = [
        new ToolModel('select', null, '🖱️ Select'),
        new ToolModel('block_add', null, '🧱 Block add'),
        new ToolModel('texture_add', 'https://pbs.twimg.com/media/EOpI7_3WsAA1hkU?format=jpg&name=360x360', '🖌️ Brush (texture coloring)'),
        /*new ToolModel(Map.EDITION_MODE.ITEM_DROP, null, '📦 Furniture add'),*/
        new ToolModel('delete', null, '🔨 Delete'),
      ]
}