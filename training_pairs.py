import json
import pickle

line_numbers = [
    294378, 177867, 453715, 618294, 750420, 1155918, 1365732, 255018, 847438, 474500, 685866, 1838623, 987469, 585160,
    1523323, 999994, 1379651, 1844557, 985440, 925176, 1357101, 564640, 1290841, 998935, 1307367, 1721690, 1537013,
    1115831, 1091258, 978230, 946389, 901237, 618514, 777350, 1019815, 352627, 729252, 907898, 1306143, 1424515
]
pairs = sc.textFile('hdfs://had00.amazinghiring.com:9000/user/hadoop/profile-pairs')
json_pairs = pairs.zipWithIndex().filter(
    lambda p_i: p_i[1] in line_numbers
).map(lambda p_i: json.loads(p_i[0])).collect()

training_pairs = {
    tuple(sorted([p['up1']['docId'], p['up2']['docId']])): {'first': p['up1'], 'second': p['up2'], 'label': None}
    for p in json_pairs
}

with open('training_pairs', 'wb') as f:
    pickle.dump(training_pairs, f, pickle.HIGHEST_PROTOCOL)
