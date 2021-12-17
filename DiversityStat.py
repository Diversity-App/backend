from pandas import DataFrame
from pandas.io.pytables import dropna_doc
from pymongo import MongoClient

#documentation exemple
""" data = pd.read_excel('titanic3.xls')
print(data.shape) # x(col), y(lignes)
print(data.columns) # x(col)
print(data.head()) # debut de notre tableau

#enlever les column inutiles : ex = numeros du ticket
data = data.drop(['name', 'sibsp', 'parch', 'ticket', 'fare', 'cabin', 'embarked', 'boat', 'body'], axis=1)

print(data.head()) # debut de notre tableau

data.describe() # decrit les stats de base pour notre tableaus

data = data.dropna(axis=0) #supprimer les lignes ou il y a des données manquantes 

print(data.shape)

print(data['pclass'].value_counts()) #donne le nombres de personnes dans chaque class (1er , 2eme, 3eme)

print(data['pclass'].value_counts().plot.bar()) # faire un graphique en bar

print(data.groupby(['sex']).mean()) #fait un tableau en fonction des sex des personnes et affiche la moyenne

print(data.groupby(['sex', 'pclass']).mean()) #fait un tableau en fonction des sex et des class des personnes et affiche la moyenne
 """

def GetDatabase():
    #connexion a la base de données
    CONNECTION_STRING = "mongodb://localhost:27017"
    client = MongoClient(CONNECTION_STRING)
    #return la database infoyt
    return client['InfoYT']

def GetQuery():
    dbname = GetDatabase()
    #recuperation de la collection clients
    collection_name = dbname["clients"]
    item_details = collection_name.find()
    #mise en place des statistiques  avec dataframe
    ItemDataFrame = DataFrame(item_details)
    #return du tableau de statistiques
    return (ItemDataFrame)

def MakeStat(ItemDataFrame):
    #enlevement des colonnes id et title (qui n est pas pertinent)
    data = ItemDataFrame.drop(["_id", "title"], axis=1)
    #enlevement des colonnes ou ils manque des infos (vide)
    data = data.dropna(axis=0)
    #print(data.shape) #combien de ligne et de colone
    print("\nList by category:\n", data['category'].value_counts()) #combien de category differents et combien de similaire
    print("\nList by tags:\n", data['tag'].value_counts()) #combien de tag different et combien de similaire
    print("\nGroup by category the different tags: ", data.groupby(['category']).sum()) #réunir tout les tags entre eux selon une category

def main():
    ItemDataFrame = GetQuery()
    MakeStat(ItemDataFrame)

if __name__ == "__main__":
    main()