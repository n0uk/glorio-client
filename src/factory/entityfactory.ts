import {Entity} from './entity';
import Game from '../states/game';
import Spectator from './spectator';
import LocalPlayer from "./player";
import {Pig, Chicken, Wolf, Bear, RideablePig, RideableWolf, WhiteBear, WhiteWalker} from "./animals";
import {Protocol} from "../protocol/protocol";
import EntityType = Protocol.EntityType;
import {BearMeatPickup, BoxPickup, CarrotPickup, EggPickup, PigMeatPickup} from "./pickups";
import {StoneGenerator, WinterStoneGenerator, WinterWoodGenerator, WoodGenerator} from "./generators";
import {
    WoodBlock, StoneBlock, Door, Garden, Tower, Heartstone, FoodCrate, WoodCrate, StoneCrate,
    Mannequin, SoccerBall
} from "./buildings";
import {FollowerBot, FarmerBot, GuardBot, GardenBot} from "./bots";
import {WinterFloor, WinterTower, WinterWall} from "./worldbuildings";

export class EntityFactory {
    public static create(type: EntityType, world: Game, id: number, parentId: number = -1): Entity {
        // console.log("Create type: " + EntityType[type]);
        if (type === EntityType.Spectator) {
            return new Spectator(world, id, parentId);
        } else if (type === EntityType.Player) {
            return new LocalPlayer(world, id, parentId);
        } else if (type === EntityType.FollowerBot) {
            return new FollowerBot(world, id, parentId);
        } else if (type === EntityType.FarmerBot) {
            return new FarmerBot(world, id, parentId);
        } else if (type === EntityType.GuardBot) {
            return new GuardBot(world, id, parentId);
        } else if (type === EntityType.WoodGenerator) {
            return new WoodGenerator(world, id, parentId);
        } else if (type === EntityType.StoneGenerator) {
            return new StoneGenerator(world, id, parentId);
        } else if (type === EntityType.Pig) {
            return new Pig(world, id, parentId);
        } else if (type === EntityType.Chicken) {
            return new Chicken(world, id, parentId);
        } else if (type === EntityType.Wolf) {
            return new Wolf(world, id, parentId);
        } else if (type === EntityType.Bear) {
            return new Bear(world, id, parentId);
        } else if (type === EntityType.RideablePig) {
            return new RideablePig(world, id, parentId);
        } else if (type === EntityType.PigMeatPickup) {
            return new PigMeatPickup(world, id, parentId);
        } else if (type === EntityType.BearMeatPickup) {
            return new BearMeatPickup(world, id, parentId);
        } else if (type === EntityType.EggPickup) {
            return new EggPickup(world, id, parentId);
        } else if (type === EntityType.CarrotPickup) {
            return new CarrotPickup(world, id, parentId);
        } else if (type === EntityType.BoxPickup) {
            return new BoxPickup(world, id, parentId);
        } else if (type === EntityType.WoodBlock) {
            return new WoodBlock(world, id, parentId);
        } else if (type === EntityType.StoneBlock) {
            return new StoneBlock(world, id, parentId);
        } else if (type === EntityType.Door) {
            return new Door(world, id, parentId);
        } else if (type === EntityType.Garden) {
            return new Garden(world, id, parentId);
        } else if (type === EntityType.Tower) {
            return new Tower(world, id, parentId);
        } else if (type === EntityType.Heartstone) {
            return new Heartstone(world, id, parentId);
        } else if (type === EntityType.FoodCrate) {
            return new FoodCrate(world, id, parentId);
        } else if (type === EntityType.WoodCrate) {
            return new WoodCrate(world, id, parentId);
        } else if (type === EntityType.StoneCrate) {
            return new StoneCrate(world, id, parentId);
        } else if (type === EntityType.RideableWolf) {
            return new RideableWolf(world, id, parentId);
        } else if (type === EntityType.Mannequin) {
            return new Mannequin(world, id, parentId);
        } else if (type === EntityType.GardenBot) {
            return new GardenBot(world, id, parentId);
        } else if (type === EntityType.WhiteBear) {
            return new WhiteBear(world, id, parentId);
        } else if (type === EntityType.WinterStoneGenerator) {
            return new WinterStoneGenerator(world, id, parentId);
        } else if (type === EntityType.WinterWoodGenerator) {
            return new WinterWoodGenerator(world, id, parentId);
        } else if (type === EntityType.SoccerBall) {
            return new SoccerBall(world, id, parentId);
        } else if (type === EntityType.FireballBullet) {
            return new SoccerBall(world, id, parentId); // FIXME
        } else if (type === EntityType.NightmareBoss) {
            return new GardenBot(world, id, parentId); // FIXME
        } else if (type === EntityType.WhiteWalker) {
            return new WhiteWalker(world, id, parentId);
        } else if (type === EntityType.WinterWall) {
            return new WinterWall(world, id, parentId);
        } else if (type === EntityType.WinterFloor) {
            return new WinterFloor(world, id, parentId);
        } else if (type === EntityType.WinterTower) {
            return new WinterTower(world, id, parentId);
        } else if (type === EntityType.WhiteBearHat) {
            return new WinterTower(world, id, parentId);
        }
        return new Entity(world, id, parentId);
    }
}