import { NewOffer as NewOfferPackable, UpdateOffer as UpdateOfferPackable, CancelOffer as CancelOfferPackable } from "../generated/PIBP2PPackable/PIBP2PPackable";
import { Offer, OfferCommodity, Commodity, Token, OfferPackable } from "../generated/schema";
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { getNickname } from "./user";

export function createOfferPackable(event: NewOfferPackable): void {
    let offer = new OfferPackable(event.params.offerId.toHexString());

    offer.owner = event.params.owner.toHexString();
    offer.sellToken = event.params.sellToken.toHexString();
    offer.sellId = event.params.sellToken.toHex().concat("-").concat(event.params.sellId.toHexString());
    offer.sellAmount = event.params.sellAmount;
    offer.buyToken = event.params.buyToken.toHexString();
    offer.buyAmount = event.params.buyAmount;
    offer.price = event.params.buyAmount;
    if (event.params.sellAmount > BigInt.fromI32(0)) {
        offer.price_per_unit = event.params.buyAmount.times(getOneEther()).div(event.params.sellAmount);
    } else {
        offer.price_per_unit = BigInt.fromI32(0);
    }
    offer.initialSellAmount = event.params.sellAmount;
    offer.isPartial = event.params.isPartial;
    offer.minDealAmount = event.params.minDealAmount;
    offer.maxDealAmount = event.params.maxDealAmount;
    offer.description = event.params.description;
    offer.isOpen = true;
    offer.timestamp = event.block.timestamp;
    offer.deals = [];

    offer.save();
}

export function updateOfferPackable(event: UpdateOfferPackable): void {
    let offer = OfferPackable.load(event.params.offerId.toHexString());

    offer.sellAmount = event.params.sellAmount;
    offer.buyAmount = event.params.buyAmount;
    offer.price = event.params.buyAmount;
    if (offer.sellAmount > BigInt.fromI32(0)) {
        offer.price_per_unit = offer.price.times(getOneEther()).div(offer.sellAmount);
    } else {
        offer.price_per_unit = BigInt.fromI32(0);
    }
    

    if ((event.params.sellAmount == BigInt.fromI32(0)) && (event.params.buyAmount == BigInt.fromI32(0))) {
        offer.isOpen = false;
    }

    offer.save();
}

export function cancelOfferPackable(event: CancelOfferPackable): void {
    let offer = OfferPackable.load(event.params.offerId.toHexString());

    offer.isOpen = false;

    offer.save();
}

export function pushDealToOffer(offerId: string, dealId: string): void {
    let offer = Offer.load(offerId);

    if (offer != null) {
        let array = offer.deals;
        array.push(dealId);
        offer.deals = array;

        offer.save();
    }
}

export function pushDealToOfferPackable(offerId: string, dealId: string): void {
    let offer = OfferPackable.load(offerId);

    if (offer != null) {
        let array = offer.deals;
        array.push(dealId);
        offer.deals = array;

        offer.save();
    }
}

export function getOneEther(): BigInt {
    let n = BigInt.fromI32(1);
    for(let i = 0; i < 18; i++) {
        n = n.times(BigInt.fromI32(10));
    }
    return n;
}