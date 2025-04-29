import requests


def GoogleLoginHelper(access_token:str):
    try:
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if google_response.status_code != 200:
            return None

        user_info = google_response.json()
        return user_info
    except Exception as e:
        print(e)
        return None
