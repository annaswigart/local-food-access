import os
import csv
import json
import itertools

def income_by(variable):
	csv_file = open(os.path.join(os.path.dirname(__file__), "_data/income_by_" + variable + ".csv"), 'r')
	json_file = open(os.path.join(os.path.dirname(__file__), "_json/income_by_" + variable + ".json"), 'w')

	keys = []
	values = []

	first_line = True
	for row in csv_file:
		split_row = row.split(',')
		if first_line:
			keys.append(split_row)
			first_line = False
		else:
			print row
			# for item in split_row:
			# 	if item != split_row[0]:
			# 		values.append([split_row[0], item])

	print keys[0]
	# print values

income_by('age')