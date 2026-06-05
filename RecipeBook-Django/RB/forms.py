from django import forms

class MoodSituationForm(forms.Form):
    mood = forms.ChoiceField(
        choices=[
            ('Happy', 'Happy'),
            ('Sad', 'Sad'),
            ('Excited', 'Excited'),
            ('Stressed', 'Stressed'),
            ('Relaxed', 'Relaxed'),
            ('Confused', 'Confused'),
            ('Bored', 'Bored'),
            ('Tired', 'Tired'),
            ('Angry', 'Angry'),
            ('Joyful', 'Joyful'),
        ],
        label='Select Your Mood'
    )
    situation = forms.ChoiceField(
        choices=[
            ('Reading Book', 'Reading Book'),
            ('Workout', 'Workout'),
            ('Watching Movie', 'Watching Movie'),
            ('Cooking', 'Cooking'),
            ('Eating Out', 'Eating Out'),
            ('Working', 'Working'),
            ('Socializing', 'Socializing'),
            ('Sleeping', 'Sleeping'),
            ('Driving', 'Driving'),
            ('Holiday', 'Holiday'),
        ],
        label='Select the Situation'
    )
