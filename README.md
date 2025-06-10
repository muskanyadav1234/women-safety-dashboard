# Women Safety Dashboard Project

## Overview
This project analyzes and visualizes women safety-related incidents across major Indian cities. It demonstrates data preprocessing, cleaning, feature engineering, and visualization for insights and storytelling.

## Dataset
- **File:** `women_safety_sample.csv`
- **Columns:**
  - `city`: Name of the city
  - `year`: Year of the incident
  - `crime_type`: Type of crime (e.g., Harassment, Assault)
  - `incidents`: Number of reported incidents

## Steps
1. **Data Preprocessing:**
   - Load the dataset
   - Check and handle missing values
   - Feature engineering (total incidents per city/year)
2. **Summary Statistics:**
   - Descriptive statistics for numeric columns
3. **Visualizations:**
   - Bar plot: Incidents by city and crime type
   - Line plot: Yearly trend of incidents by city

## How to Run
1. Install requirements:
   ```bash
   pip install pandas matplotlib seaborn
   ```
2. Run the preprocessing script:
   ```bash
   python women_safety_preprocessing.py
   ```
3. Check the generated PNG files for visualizations.

## Submission Checklist
- [x] Data cleaning and handling missing values
- [x] Feature selection and engineering
- [x] Data integrity and consistency
- [x] Summary statistics and insights
- [x] Initial visual representation of key findings

## For GitHub Submission
- Ensure this folder is pushed to your public repository.
- Include screenshots of the generated plots in your presentation file.