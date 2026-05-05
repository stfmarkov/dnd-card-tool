package main

import "strings"

type FilterFunction func(card *CardData, filter Filter) bool

func searchFilter(card *CardData, search string) bool {
	if search == "" {
		return true
	}
	s := strings.ToLower(search)
	return strings.Contains(strings.ToLower(card.Name), s) ||
		strings.Contains(strings.ToLower(card.TypeLine), s) ||
		strings.Contains(strings.ToLower(card.Rarity), s) ||
		strings.Contains(strings.ToLower(card.Description), s) ||
		strings.Contains(strings.ToLower(card.FooterText), s)
}

func compareTypeLine(card *CardData, filter Filter) bool {
	if filter.Comparison == "eq" {
		return card.TypeLine == filter.Value
	}

	return false
}

func compareRarity(card *CardData, filter Filter) bool {
	if filter.Comparison == "eq" {
		return card.Rarity == filter.Value
	}

	return false
}

func comparisonFilters(card *CardData, filters []Filter) bool {

	implementedFilters := map[string]FilterFunction{
		"typeLine": compareTypeLine,
		"rarity":   compareRarity,
	}

	for _, filter := range filters {
		filterFunction, ok := implementedFilters[filter.Property]
		if !ok {
			continue
		}

		if !filterFunction(card, filter) {
			return false
		}
	}

	return true
}
