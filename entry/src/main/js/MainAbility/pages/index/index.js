import { addCard, addSuks, deleteCard } from '../../util/dataStore';
import { readValue } from '../../util/keyStore';
import { deleteHce, hce } from '../../util/hce';

export default {
    data: {
        cardName: ''
    },
    onInit() {
        this.setCardName();
        hce();
    },
    setCardName() {
        const cardName = readValue('cardName');
        this.cardName = cardName && cardName !== '' ? cardName : 'Card Not Found';
    },
    addCard() {
        addCard({
            name: 'My Lucky Card'
        });

        this.setCardName();

        addSuks([{}, {}, {}, {}, {}]);

        hce();
    },
    deleteCard() {
        deleteCard();
        this.setCardName();
        deleteHce();
    }
};
