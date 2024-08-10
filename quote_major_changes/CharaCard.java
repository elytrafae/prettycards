package quote_major_changes;

abstract class Card {}
abstract class Target {}
abstract class Artifact {}
abstract class Player {
    public void addArtifact(Artifact art) {

    }

    public void addCardToHand(Card card) {

    }
}



public class CharaCard extends Card {

    private Player owner;

    public void magicEvent() {
        getOwner().addArtifact(new GenocideArtifact());
        getOwner().addCardToHand(new RealKnifeCard());
    }

    public Player getOwner() {
        return owner;
    }


}