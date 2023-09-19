from setuptools import find_packages,setup
from typing import List


HYPHEN_E_DOT='-e .'


def get_requirements(path: str) -> List[str]:
    """Reads requirements from a file and returns a list of requirements."""
    requirements=[]
    with open (path) as f:
        requirements=f.readlines()
        requirements=[req.replace("\n","") for req in requirements]
        if HYPHEN_E_DOT in requirements:
            requirements.remove(HYPHEN_E_DOT)
    return requirements        



setup(
    name='Smart Mall Management System',
    version='0.0.1',
    author="surya",
    author_email="suryaprakashk1805@gmail.com",
    packages=find_packages(),
    install_requires=get_requirements("requirements.txt")
 )