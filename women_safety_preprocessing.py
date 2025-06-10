import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
df = pd.read_excel('crime_data.csv.xlsx')

# Data Cleaning
print('Initial Data:')
print(df.head())
print('\nMissing values per column:')   
print(df.isnull().sum())

# Handle missing values (if any)
df = df.dropna()

# Feature Engineering: Total incidents per city and year
total_incidents = df.groupby(['city', 'year'])['incidents'].sum().reset_index()

# Summary Statistics
print('\nSummary Statistics:')
print(df.describe())

# Visualization: Bar plot of incidents by city and crime type
plt.figure(figsize=(10,6))
sns.barplot(data=df, x='city', y='incidents', hue='crime_type')
plt.title('Incidents by City and Crime Type')
plt.ylabel('Number of Incidents')
plt.xlabel('City')
plt.legend(title='Crime Type')
plt.tight_layout()
plt.savefig('incidents_by_city_crimetype.png')
plt.close()

# Visualization: Trend over years
plt.figure(figsize=(10,6))
sns.lineplot(data=total_incidents, x='year', y='incidents', hue='city', marker='o')
plt.title('Yearly Trend of Incidents by City')
plt.ylabel('Total Incidents')
plt.xlabel('Year')
plt.legend(title='City')
plt.tight_layout()
plt.savefig('yearly_trend_by_city.png')
plt.close()

print('Preprocessing and visualizations complete. Check generated PNG files.')