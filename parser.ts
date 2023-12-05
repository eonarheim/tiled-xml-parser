import { z } from 'zod';
const TiledIntProperty = z.object({
    name: z.string(),
    type: z.literal('int'),
    value: z.number().int()
})

const TiledBoolProperty = z.object({
    name: z.string(),
    type: z.literal('bool'),
    value: z.boolean()
})

const TiledFloatProperty = z.object({
    name: z.string(),
    type: z.literal('float'),
    value: z.number()
})

const TiledStringProperty = z.object({
    name: z.string(),
    type: z.literal('string'),
    value: z.string()
})

const TiledFileProperty = z.object({
    name: z.string(),
    type: z.literal('file'),
    value: z.string()
})

const TiledColorProperty = z.object({
    name: z.string(),
    type: z.literal('color'),
    value: z.string()
})

const TiledProperty = z.discriminatedUnion("type", [
    TiledIntProperty,
    TiledBoolProperty,
    TiledFloatProperty,
    TiledStringProperty,
    TiledFileProperty,
    TiledColorProperty
]);

const TiledTileLayerBase = z.object({
    name: z.string(),
    type: z.literal("tilelayer"),
    height: z.number(),
    width: z.number(),
    x: z.number(),
    y: z.number(),
    id: z.number(),
    opacity: z.number(),
    properties: z.array(TiledProperty).optional(),
    visible: z.boolean(),
});

const TiledTileLayerCSV = TiledTileLayerBase.extend({
    data: z.array(z.number()),
    encoding: z.literal('csv')
})

const TiledTileLayerBase64 = TiledTileLayerBase.extend({
    data: z.string(),
    encoding: z.literal('base64'),
    compression: z.string(),
});

const TiledTileLayer = z.discriminatedUnion('encoding', 
    [TiledTileLayerBase64, TiledTileLayerCSV]);

const TiledPoint = z.object({
    x: z.number(),
    y: z.number()
});

const TiledPolygon = z.array(TiledPoint);

const TiledObject = z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    x: z.number(),
    y: z.number(),
    rotation: z.number(),
    height: z.number(),
    width: z.number(),
    visible: z.boolean(),
    point: z.boolean().optional(),
    ellipse: z.boolean().optional(),
    polygon: TiledPolygon.optional(),
    properties: z.array(TiledProperty).optional(),
})

const TiledAnimation = z.object({
    id: z.number(),
    animation: z.array(z.object({
        duration: z.number(),
        tileid: z.number()
    }))
});

const TiledObjectLayer = z.object({
    name: z.string(),
    draworder: z.string(),
    type: z.literal("objectgroup"),
    x: z.number(),
    y: z.number(),
    id: z.number(),
    opacity: z.number(),
    properties: z.array(TiledProperty).optional(),
    visible: z.boolean(),
    objects: z.array(TiledObject)
});

const TiledImageLayer = z.object({
    name: z.string(),
    x: z.number(),
    y: z.number(),
    id: z.number(),
    image: z.string(),
    opacity: z.number(),
    properties: z.array(TiledProperty).optional(),
    visible: z.boolean(),
});

// const TiledGroupLayerBase = z.object({
//     name: z.string(),
//     id: z.number(),
// });
// type TiledGroupLayer = z.infer<typeof TiledTileLayerBase> & {
//     layers: TiledLayer[]
// }
const TiledLayer = z.union([
    TiledImageLayer,
    TiledTileLayer,
    TiledObjectLayer,
    // TiledGroupLayerBase
]);

// const TiledGroupLayer = TiledGroupLayerBase.extend({
//     layers: z.lazy(() => z.array(TiledLayer))
// });







const TiledObjectGroup = z.object({
    draworder: z.string(),
    id: z.number(),
    name: z.string(),
    x: z.number(),
    y: z.number(),
    opacity: z.number(),
    type: z.literal("objectgroup"),
    visible: z.boolean(),
    objects: z.array(TiledObject)
})

const TiledTile = z.object({
    id: z.number(),
    type: z.string().optional(),
    objectgroup: TiledObjectGroup,
    properties: z.array(TiledProperty).optional()
})

const TiledTileset = z.object({
    name: z.string(),
    firstgid: z.number(),
    image: z.string(),
    imagewidth: z.number(),
    imageheight: z.number(),
    columns: z.number(),
    tileheight: z.number(),
    tilewidth: z.number(),
    tilecount: z.number(),
    spacing: z.number(),
    margin: z.number(),
    tiles: z.array(z.union([TiledTile, TiledAnimation]))
})

const TiledMap = z.object({
    type: z.string(),
    class: z.string().optional(),
    tiledversion: z.string(),
    version: z.string(),
    width: z.number(),
    height: z.number(),
    tilewidth: z.number(),
    tileheight: z.number(),
    compressionlevel: z.number().optional(),
    infinite: z.boolean(),
    nextlayerid: z.number(),
    nextobjectid: z.number(),
    orientation: z.string(),
    renderorder: z.string(),
    backgroundcolor: z.string().optional(),
    layers: z.array(TiledLayer),
    tilesets: z.array(TiledTileset),
    properties: z.array(TiledProperty).optional()
})

// TODO export all types
export type TiledObjectGroup = z.infer<typeof TiledObjectGroup>;
export type TiledObject = z.infer<typeof TiledObject>;
export type TiledTile = z.infer<typeof TiledTile>;
export type TiledTileset = z.infer<typeof TiledTileset>;
export type TiledMap = z.infer<typeof TiledMap>;
export type TiledLayer = z.infer<typeof TiledLayer>;
export type TiledProperty = z.infer<typeof TiledProperty>;
export type TiledPropertyTypes = Pick<TiledProperty, 'type'>['type'];

export class Parser {

    _coerceNumber(value: any) {
        return +value;
    }
    _coerceBoolean(value: any) {
        return value === "0" ? false : !!(Boolean(value));
    }

    _coerceType(type: TiledPropertyTypes, value: string) {
        if (type === 'bool') {
            return this._coerceBoolean(value);
        }

        if (type === 'int' || type === 'float') {
            return this._coerceNumber(value);
        }
        return value;
    }

    _parsePropertiesNode(propertiesNode: Element, target: any) {
        const properties = [];
        if (propertiesNode) {
            for (let prop of propertiesNode.children) {
                const type = prop.getAttribute('type') as TiledPropertyTypes;
                properties.push({
                    name: prop.getAttribute('name'),
                    type: type,
                    value: this._coerceType(type, prop.getAttribute('value') as string)
                })
            }
        }
        target.properties = properties;
    }

    _parseAttributes(node: Element, target: any) {
        const numberProps = [
            'width',
            'height',
            'columns',
            'firstgid',
            'spacing',
            'margin',
            'tilecount',
            'tilewidth',
            'tileheight',
            'compressionlevel',
            'nextlayerid',
            'nextobjectid',
            'id',
            'x',
            'y',
            'rotation',
        ];

        const booleanProps = [
            "infinite",
            'visible'
        ]

        for (let attribute of node.attributes) {
            if (numberProps.indexOf(attribute.name as any) > -1) {
                target[attribute.name] = this._coerceNumber(attribute.value);
            } else if (booleanProps.indexOf(attribute.name as any) > -1) {
                target[attribute.name] = this._coerceBoolean(attribute.value);
            } else {
                target[attribute.name] = attribute.value;
            }
        }
    }

    parseObject(objectNode: Element): TiledObject {
        const object: any = {};
        object.name = '';
        object.type = '';
        object.visible = true;
        object.x = 0;
        object.y = 0;
        object.rotation = 0;
        object.height = 0;
        object.width = 0;
        this._parseAttributes(objectNode, object);


        const propertiesNode = objectNode.querySelector('properties') as Element;
        if (propertiesNode) {
            this._parsePropertiesNode(propertiesNode, object);
        }

        const point = objectNode.querySelector('point');
        if (point) {
            object.point = true;
        }

        const ellipse = objectNode.querySelector('ellipse');
        if (ellipse) {
            object.ellipse = true;
        }

        const polygon = objectNode.querySelector('polygon');

        if (polygon) {
            const points = polygon.getAttribute('points')?.split(' ');
            object.polygon = [];
            if (points) {
                points.forEach(p => {
                    const point = p.split(',');
                    object.polygon.push({
                        x: +point[0],
                        y: +point[1]
                    })
                })
            }
        }

        return TiledObject.parse(object);
    }

    parseTileset(tilesetNode: Element): TiledTileset {
        const tileset: any = {};
        tileset.spacing = 0;
        tileset.margin = 0;
        tileset.tiles = [];
        this._parseAttributes(tilesetNode, tileset);

        for (let tilesetChild of tilesetNode.children) {
            switch (tilesetChild.tagName) {
                case 'image': {
                    tileset.image = tilesetChild.getAttribute('source');
                    tileset.imagewidth = this._coerceNumber(tilesetChild.getAttribute('width'));
                    tileset.imageheight = this._coerceNumber(tilesetChild.getAttribute('height'));
                    break;
                }
                case 'tile': {
                    const tile: any = {};
                    this._parseAttributes(tilesetChild, tile);
                    for (let tileChild of tilesetChild.children) {
                        switch (tileChild.tagName) {
                            case 'objectgroup': {
                                const objectgroup: any = {};
                                objectgroup.type = 'objectgroup';
                                objectgroup.name = "";
                                objectgroup.visible = true;
                                objectgroup.x = 0;
                                objectgroup.y = 0;
                                objectgroup.opacity = 1;
                                objectgroup.objects = [];
                                this._parseAttributes(tileChild, objectgroup);
                                tile.objectgroup = objectgroup;

                                for (let objectChild of tileChild.children) {
                                    const object = this.parseObject(objectChild);
                                    objectgroup.objects.push(object);
                                }
                                break;
                            }
                            case 'animation': {
                                const animation: any = [];
                                for (let frameChild of tileChild.children) {
                                    animation.push({
                                        duration: this._coerceNumber(frameChild.getAttribute('duration')),
                                        tileid: this._coerceNumber(frameChild.getAttribute('tileid'))
                                    })
                                }

                                tile.animation = animation;
                                break;
                            }
                            case 'properties': {
                                this._parsePropertiesNode(tileChild, tile);
                                break;
                            }
                        }
                    }

                    tileset.tiles.push(tile);
                    break;
                }
            }
        }
        return TiledTileset.parse(tileset);
    }

    parseTileLayer(layerNode: Element): TiledLayer {
        const layer: any = {};
        layer.type = 'tilelayer';
        layer.compression = ''; // default uncompressed
        layer.x = 0;
        layer.y = 0;
        layer.opacity = 1;
        layer.visible = true;
        this._parseAttributes(layerNode, layer);

        for (let layerChild of layerNode.children) {
            switch (layerChild.tagName) {
                case 'properties': {
                    this._parsePropertiesNode(layerChild, layer);
                    break;
                }
                case 'data': {
                    const encoding = layerChild.getAttribute('encoding');
                    // technically breaking compat, but this is useful
                    layer.encoding = encoding; 

                    switch(layer.encoding) {
                        case 'base64': {
                            layer.data = layerChild.textContent?.trim();
                            break;
                        }
                        case 'csv': {// csv case
                            layer.data = layerChild.textContent?.split(',').map(id => +id);
                            break;
                        }
                    }
                }
            }
        }
        return TiledLayer.parse(layer);
    }

    parseObjectGroup(groupNode: Element): TiledLayer {
        const group: any = {};
        group.type = 'objectgroup';
        group.draworder = 'topdown';
        group.visible = true;
        group.x = 0;
        group.y = 0;
        group.opacity = 1;
        group.objects = [];
        this._parseAttributes(groupNode, group);
        for (let groupChild of groupNode.children) {
            switch (groupChild.tagName) {
                case 'properties': {
                    this._parsePropertiesNode(groupChild, group);
                    break;
                }
                case 'object': {
                    const object = this.parseObject(groupChild);
                    group.objects.push(object);
                    break;
                }
            }
        }
        
        return TiledLayer.parse(group);
    }

    parseImageLayer(imageNode: Element): TiledLayer {
        const imageLayer: any = {};
        imageLayer.type = 'imagelayer';
        imageLayer.visible = true;
        imageLayer.x = 0;
        imageLayer.y = 0;
        imageLayer.opacity = 1;

        const image = imageNode.querySelector('image');
        imageLayer.image = image?.getAttribute('source');

        this._parseAttributes(imageNode, imageLayer);
        
        return TiledLayer.parse(imageLayer);
    }


    /**
     * Takes Tiled tmx xml and produces the equivalent Tiled tmj (json) content
     * @param xml 
     * @returns 
     */
    parse(xml: string): TiledMap {
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(xml, 'application/xml');

        const mapElement = doc.getElementsByTagName('map')[0];

        const tiledMap: any = {};
        tiledMap.type = 'map';
        tiledMap.compressionlevel = -1;
        tiledMap.layers = [];
        tiledMap.tilesets = [];

        this._parseAttributes(mapElement, tiledMap);

        const parseHelper = (node: Element) => {
            console.log(node);
            switch (node.tagName) {
                case 'group': {
                    // recurse through groups!
                    // TODO currently we support groups by flattening them :/
                    for (let child of node.children) {
                        parseHelper(child);
                    }
                    break;
                }
                case 'layer': {
                    const layer = this.parseTileLayer(node);
                    tiledMap.layers.push(layer);
                    break;
                }
                case 'properties': {
                    this._parsePropertiesNode(node, tiledMap);
                    break;
                }
                case 'tileset': {
                    const tileset = this.parseTileset(node);
                    tiledMap.tilesets.push(tileset);
                    break;
                }
                case 'objectgroup': {
                    const objectgroup = this.parseObjectGroup(node);
                    tiledMap.layers.push(objectgroup);
                    break;
                }
                case 'imagelayer': {
                    const imageLayer = this.parseImageLayer(node);
                    tiledMap.layers.push(imageLayer);
                    break;
                }
            }
        }

        for (let mapChild of mapElement.children) {
            parseHelper(mapChild);
        }

        console.log(mapElement);

        const parsed = TiledMap.parse(tiledMap);

        return parsed;
    }
}