import os
import csv
import json
import itertools



variables = ['Education', 'Age']

for variable in variables:
	file_name = 'income_by_' + variable.lower()
	people = {}

	f = open(os.path.join(os.path.dirname(__file__), file_name + '.csv'), 'r')

	reader = csv.reader(f)
	header = reader.next()

	dict_reader = csv.DictReader(f, header)

	people_dict = {}
	for row in dict_reader:
		people_dict[row[variable]] = {'food': row['Mean Food'], 'food_at_home': row['Mean Food at Home'], 'income': row['Mean Income'], 'expenditures': row['Mean Expenditures']}

	with open(os.path.join(os.path.dirname(__file__), file_name + '.json'), 'w') as outfile:
	  json.dump(people_dict, outfile)