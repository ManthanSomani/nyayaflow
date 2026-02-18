
# This script represents the ML logic that powers NyayaFlow's prediction engine
import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

def generate_synthetic_data(n=500):
    np.random.seed(42)
    data = {
        'case_id': [f"CASE-{2025}-{i}" for i in range(n)],
        'case_type': np.random.choice(['civil', 'criminal', 'family', 'traffic', 'consumer'], n),
        'filing_year': np.random.randint(2018, 2026, n),
        'case_age_days': np.random.randint(50, 2501, n),
        'claim_amount': np.random.randint(1000, 1000001, n),
        'previous_adjournments': np.random.randint(0, 16, n),
        'lawyer_reliability': np.random.uniform(0.3, 0.95, n),
        'document_completeness': np.random.uniform(0.4, 1.0, n),
        'witness_required': np.random.choice([0, 1], n),
        'police_report_pending': np.random.choice([0, 1], n),
        'court_workload_today': np.random.randint(20, 121, n),
    }
    
    df = pd.DataFrame(data)
    
    # Target Logic
    # Settlement possible if civil/family and small claim
    df['settlement_possible'] = ((df['case_type'].isin(['civil', 'family', 'consumer'])) & 
                                (df['claim_amount'] < 100000)).astype(int)
    
    # Likely delay if low reliability and many adjournments
    df['likely_delay'] = ((df['lawyer_reliability'] < 0.5) | 
                         (df['previous_adjournments'] > 8) |
                         (df['witness_required'] == 1)).astype(int)
    
    # Estimated duration: criminal cases take longer
    df['estimated_hearing_minutes'] = np.where(df['case_type'] == 'criminal', 
                                               np.random.randint(30, 61, n), 
                                               np.random.randint(5, 31, n))
    
    return df

def train_models(df):
    le = LabelEncoder()
    df['case_type_enc'] = le.fit_transform(df['case_type'])
    
    features = ['case_type_enc', 'case_age_days', 'claim_amount', 'previous_adjournments', 
                'lawyer_reliability', 'document_completeness']
    
    X = df[features]
    
    # Model A: Settlement Predictor
    y_settle = df['settlement_possible']
    X_train, X_test, y_train, y_test = train_test_split(X, y_settle, test_size=0.2)
    m_settle = RandomForestClassifier().fit(X_train, y_train)
    print(f"Settlement Accuracy: {m_settle.score(X_test, y_test)}")
    
    # Save models
    with open('settlement_predictor.pkl', 'wb') as f:
        pickle.dump(m_settle, f)

if __name__ == "__main__":
    df = generate_synthetic_data()
    train_models(df)
    df.to_csv('court_cases.csv', index=False)
