import { Deal, Offer, DealCommodity, DealPackable, OfferPackable } from "../generated/schema";
import { BigDecimal, Address, BigInt } from "@graphprotocol/graph-ts";
import { NewDeal as NewDealPackable } from "../generated/PIBP2PPackable/PIBP2PPackable";
import { pushDealToOfferPackable } from "./offer";

export function createPackableDeal(event: NewDealPackable): void {
    let dealId = event.params.offerId.toHexString().concat("-").concat(event.logIndex.toHexString()).concat(event.block.hash.toHexString());
    let deal = DealPackable.load(dealId);

    if (deal == null) {
        deal = new DealPackable(dealId);

        deal.offer = event.params.offerId.toHexString();
        deal.buyer = event.params.buyer.toHexString();
        deal.sellAmount = event.params._sellAmount;
        deal.buyAmount = event.params._buyAmount;
        deal.timestamp = event.block.timestamp;

        deal.save();

        pushDealToOfferPackable(event.params.offerId.toHexString(), dealId);
    }
}