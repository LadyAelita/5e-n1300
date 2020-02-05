init:
ifeq ($(OS),Windows_NT)     # is Windows_NT on XP, 2000, 7, Vista, 10...
	@cmd //C "md .git\hooks\utils" ||:
	@cmd //C "del .git\hooks\pre-commit" ||:
	@cmd //C "del .git\hooks\post-commit" ||:
	@cmd //C "del .git\hooks\post-merge" ||:
	@cmd //C "del .git\hooks\utils\spellsConverter.py" ||:
	@cmd //C "mklink .git\hooks\pre-commit ..\..\githooks\pre-commit"
	@cmd //C "mklink .git\hooks\post-commit ..\..\githooks\post-commit"
	@cmd //C "mklink .git\hooks\post-merge ..\..\githooks\post-merge"
	@cmd //C "mklink .git\hooks\utils\spellsConverter.py ..\..\..\githooks\utils\spellsConverter.py"
else
	@mkdir -p -- .git/hooks/utils ||:
	@ln -s -f ../../githooks/post-merge .git/hooks/post-merge
	@ln -s -f ../../githooks/pre-commit .git/hooks/pre-commit
	@ln -s -f ../../githooks/post-commit .git/hooks/post-commit
	@ln -s -f ../../../githooks/utils/spellsConverter.py .git/hooks/utils/spellsConverter.py
endif

spells:
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Spells.csv"
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Bard Spells.csv" --class Bard
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Cleric Spells.csv" --class Cleric
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Druid Spells.csv" --class Druid
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Paladin Spells.csv" --class Paladin
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Ranger Spells.csv" --class Ranger
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Warlock Spells.csv" --class Warlock
	@python .git/hooks/utils/spellsConverter.py --from n1300md --to csvIndex -m -p en_US/spells -t "../indices/Wizard & Sorcerer Spells.csv" --class Wizard
	@git add en_US/indices/Spells.csv
	@git add "en_US/indices/Bard Spells.csv"
	@git add "en_US/indices/Cleric Spells.csv"
	@git add "en_US/indices/Druid Spells.csv"
	@git add "en_US/indices/Paladin Spells.csv"
	@git add "en_US/indices/Ranger Spells.csv"
	@git add "en_US/indices/Warlock Spells.csv"
	@git add "en_US/indices/Wizard & Sorcerer Spells.csv"

host:
	python -m SimpleHTTPServer 8080
