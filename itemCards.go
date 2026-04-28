package main

import (
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

const cardsDir = "item-cards"
const cardsJsonFileName = "cards.json"

func createCardsJsonFile() error {
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Join(userConfigDir, cardsDir), 0o755)
	if err != nil {
		return err
	}

	err = os.WriteFile(filepath.Join(userConfigDir, cardsDir, cardsJsonFileName), []byte("[]"), 0o644)
	if err != nil {
		return err
	}
	return nil
}

func saveCardsToJson(cards []CardData) error {
	jsonData, err := json.Marshal(cards)
	if err != nil {
		return err
	}
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(userConfigDir, cardsDir, cardsJsonFileName), jsonData, 0o644)
}

func addCard(card SaveCardDataRequest) error {
	cards, err := readCardsFromJson()
	if err != nil {
		return err
	}

	newCard := CardData{
		ID:          uuid.New().String(),
		Name:        card.Name,
		TypeLine:    card.TypeLine,
		Description: card.Description,
		FooterText:  card.FooterText,
		Rarity:      card.Rarity,
		Artwork:     card.Artwork,
	}
	cards = append(cards, newCard)
	return saveCardsToJson(cards)
}

func readCardsFromJson() ([]CardData, error) {
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return nil, err
	}
	jsonFile, err := os.Open(filepath.Join(userConfigDir, cardsDir, cardsJsonFileName))
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			err = createCardsJsonFile()
			if err != nil {
				return nil, err
			}
			return []CardData{}, nil
		} else {
			return nil, err
		}
	}
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		return nil, err
	}

	var cards []CardData

	err = json.Unmarshal(byteValue, &cards)
	if err != nil {
		return nil, err
	}

	return cards, nil
}

func updateCardById(id string, card CardData) error {
	cards, err := readCardsFromJson()
	if err != nil {
		return err
	}
	for i, cardData := range cards {
		if cardData.ID == id {
			cards[i] = card
			return saveCardsToJson(cards)
		}
	}
	return errors.New("card not found")
}

func deleteCardById(id string) error {
	cards, err := readCardsFromJson()
	if err != nil {
		return err
	}
	for i, cardData := range cards {
		if cardData.ID == id {
			cards = append(cards[:i], cards[i+1:]...)
			return saveCardsToJson(cards)
		}
	}
	return errors.New("card not found")
}
